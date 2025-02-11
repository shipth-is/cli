// Table.tsx
// From https://github.com/maticzav/ink-table/issues/268 and modified
import React from 'react'
import {Box, Text, TextProps} from 'ink'
import {Scalar, ScalarDict} from '@cli/types'

type Column = {
  key: string
  width: number
}

const BASE_HEADER_PROPS: TextProps = {
  color: 'blue',
  bold: true,
}

const BASE_TEXT_PROPS: TextProps = {
  color: 'white',
}

type ColumnTextProps = {
  [key: string]: TextProps
}

export type TableProps = {
  data: ScalarDict[]
  showHeaders?: boolean
  headerTextProps?: TextProps
  columnTextProps?: ColumnTextProps
  getTextProps?: (column: Column, value: Scalar) => TextProps | undefined
}

// Helper function to generate headers from data
function generateHeaders(data: ScalarDict[]): ScalarDict {
  let headers: ScalarDict = {}

  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      headers[key] = key
    })
  })

  return headers
}

export const Table = ({data, showHeaders = true, headerTextProps, columnTextProps, getTextProps}: TableProps) => {
  // Determine columns and their widths
  const columns: Column[] = getColumns(data)

  const fullHeaderTextProps = {
    ...BASE_HEADER_PROPS,
    ...headerTextProps,
  }

  return (
    <Box flexDirection="column">
      {renderHeaderSeparators(columns)}

      {showHeaders && (
        <>
          {renderRow(generateHeaders(data), columns, fullHeaderTextProps)}
          {renderRowSeparators(columns)}
        </>
      )}

      {data.map((row, index) => (
        <React.Fragment key={`row-${index}`}>
          {index !== 0 && renderRowSeparators(columns)}
          {renderRow(row, columns, BASE_TEXT_PROPS, columnTextProps, getTextProps)}
        </React.Fragment>
      ))}
      {renderFooterSeparators(columns)}
    </Box>
  )
}

// Helper function to determine columns and their widths
function getColumns(data: ScalarDict[]): Column[] {
  let columnWidths: {[key: string]: number} = {}

  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const valueLength = row[key]?.toString().length || 0
      columnWidths[key] = Math.max(columnWidths[key] || key.length, valueLength)
    })
  })

  return Object.keys(columnWidths).map((key) => ({
    key: key,
    width: (columnWidths[key] ?? 0) + 2, // adding padding
  }))
}

// Helper function to render a row with separators
function renderRow(
  row: ScalarDict,
  columns: Column[],
  baseCellTextProps?: TextProps,
  columnTextProps?: ColumnTextProps,
  getTextProps?: (column: Column, value: Scalar) => TextProps | undefined,
) {
  const getDisplayValue = (row: ScalarDict, column: Column) => {
    const value = row[column.key]
    if (typeof value === 'boolean') return value ? 'YES' : 'NO'
    return value?.toString() || ''
  }

  const getTextPropsForCell = (row: ScalarDict, column: Column) => {
    const {key} = column
    const value = row[key]
    const columnTextPropsForCell = columnTextProps?.[key] || {}
    const valueBasedProps = typeof row[column.key] === 'boolean' ? {color: value == false ? 'red' : 'green'} : {}
    const callbackBasedProps = getTextProps ? getTextProps(column, value) : {}
    return {
      ...baseCellTextProps,
      ...columnTextPropsForCell,
      ...valueBasedProps,
      ...callbackBasedProps,
    }
  }

  return (
    <Box flexDirection="row">
      <Text>│</Text>
      {columns.map((column, index) => {
        const cellTextProps = getTextPropsForCell(row, column)
        return (
          <React.Fragment key={column.key}>
            {index !== 0 && <Text>│</Text>}
            {/* Add separator before each cell except the first one */}
            <Box width={column.width} justifyContent="center">
              <Text {...cellTextProps}>{getDisplayValue(row, column)}</Text>
            </Box>
          </React.Fragment>
        )
      })}
      <Text>│</Text>
    </Box>
  )
}

function renderHeaderSeparators(columns: Column[]) {
  return renderRowSeparators(columns, '┌', '┬', '┐')
}

function renderFooterSeparators(columns: Column[]) {
  return renderRowSeparators(columns, '└', '┴', '┘')
}

function renderRowSeparators(columns: Column[], leftChar = '├', midChar = '┼', rightChar = '┤') {
  return (
    <Box flexDirection="row">
      <Text>{leftChar}</Text>
      {columns.map((column, index) => (
        <React.Fragment key={column.key}>
          <Text>{'─'.repeat(column.width)}</Text>
          {index < columns.length - 1 ? <Text>{midChar}</Text> : <Text>{rightChar}</Text>}
        </React.Fragment>
      ))}
    </Box>
  )
}
