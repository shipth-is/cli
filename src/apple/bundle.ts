import {
  BundleId,
  CapabilityType,
  CapabilityTypeOption,
} from "@expo/apple-utils";

// TODO: should the project be exported and this read from the plist files?
const MAPPING = {
  [CapabilityType.ACCESS_WIFI]: "com.apple.developer.networking.wifi-info",
  [CapabilityType.PUSH_NOTIFICATIONS]: "aps-environment",
};

const ALL_CAPABILITIES = [
  CapabilityType.ACCESS_WIFI,
  CapabilityType.PUSH_NOTIFICATIONS,
];

export async function updateBundleIdCapabilities(
  bundleId: BundleId,
  capabilities: CapabilityType[]
): Promise<void> {
  const current = await bundleId.getBundleIdCapabilitiesAsync();

  let existing = [];

  for (const capability of current) {
    // determine the type of the capability
    const capabilityType = ALL_CAPABILITIES.find((c) => capability.isType(c));
    if (capabilityType) {
      existing.push(capabilityType);
    }
  }

  console.log("Existing capabilities", existing);

  const toRemove = existing.filter((c) => !capabilities.includes(c));
  const toAdd = capabilities.filter((c) => !existing.includes(c));

  for (const capability of toRemove) {
    console.log(`Removing ${capability}`);
    await bundleId.updateBundleIdCapabilityAsync({
      capabilityType: capability,
      option: CapabilityTypeOption.OFF,
    });
  }

  for (const capability of toAdd) {
    console.log(`Adding ${capability}`);
    await bundleId.updateBundleIdCapabilityAsync({
      capabilityType: capability,
      option: CapabilityTypeOption.ON,
    });
  }
}
