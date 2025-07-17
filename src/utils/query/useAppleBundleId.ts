import type {BundleId} from '@expo/apple-utils'
import {UseQueryResult, useQuery} from '@tanstack/react-query'

import {BundleId as AppleBundleId, CapabilityType} from '@cli/apple/expo.js'
import {Platform, ScalarDict} from '@cli/types'

import {GODOT_CAPABILITIES, getGodotProjectCapabilities} from '../godot.js'

export interface AppleBundleIdQueryProps {
  ctx: any
  iosBundleId?: string
}

// TODO: fix the types
export type AppleBundleIdQueryResponse = {
  bundleId: BundleId | null
  bundleIdSummary: ScalarDict | null // for display
  capabilities: any[] | null // list of capabilities in the bundleId
  capabilitiesTable: ScalarDict[] | null // capabilities in a table format
  projectCapabilities: any[] | null // capabilities in the project
  shouldSyncCapabilities: boolean | null // if the capabilities should be synced
}

// Tells us which capabilities are enabled the Apple BundleId
export async function getBundleIdCapabilities(bundleId: BundleId): Promise<any[]> {
  const current = await bundleId.getBundleIdCapabilitiesAsync()

  const existing = []

  for (const capability of current) {
    // determine the type of the capability
    const capabilityType = Object.values(CapabilityType).find((c) => capability.isType(c))
    if (capabilityType) {
      existing.push(capabilityType)
    }
  }

  return existing
}

// Retrieves the Apple BundleId by name and compares the capabilities with the local project
export const fetchBundleId = async ({ctx, iosBundleId}: AppleBundleIdQueryProps) => {
  const empty = {
    bundleId: null,
    bundleIdSummary: null,
    capabilities: null,
    capabilitiesTable: null,
    projectCapabilities: null,
    shouldSyncCapabilities: null,
  }

  if (!iosBundleId) return empty

  const bundleId = await AppleBundleId.findAsync(ctx, {
    identifier: iosBundleId,
  })

  if (!bundleId) return empty

  const bundleIdCapabilities = await getBundleIdCapabilities(bundleId)
  const projectCapabilities = getGodotProjectCapabilities(Platform.IOS)

  const capabilitiesTable = GODOT_CAPABILITIES.map((gc) => {
    const isEnabledInBundle = bundleIdCapabilities.includes(gc.type)
    const isEnabledInProject = projectCapabilities.includes(gc.type)
    const isCorrectlyConfigured = isEnabledInBundle === isEnabledInProject
    return {
      isCorrectlyConfigured,
      isEnabledInBundle,
      isEnabledInProject,
      name: gc.name,
    }
  })

  return {
    bundleId,
    bundleIdSummary: {
      id: bundleId.id,
      identifier: bundleId.attributes.identifier,
      name: bundleId.attributes.name,
      platform: bundleId.attributes.platform,
    },
    capabilities: bundleIdCapabilities,
    capabilitiesTable,
    projectCapabilities,
    shouldSyncCapabilities: !capabilitiesTable.every((c) => c.isCorrectlyConfigured),
  }
}

export const useAppleBundleId = (props: AppleBundleIdQueryProps): UseQueryResult<AppleBundleIdQueryResponse> => {
  const queryResult = useQuery<AppleBundleIdQueryResponse>({
    queryFn: () => fetchBundleId(props),
    queryKey: ['appleBundleId', props.iosBundleId],
  })

  return queryResult
}
