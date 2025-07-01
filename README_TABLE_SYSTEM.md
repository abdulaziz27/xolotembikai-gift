# Table Design System Documentation

## Overview

This document describes the comprehensive table design system built with TanStack Table and Shadcn/ui components. The system provides consistent, reusable, and feature-rich data tables across the application.

## Features

### Core Features
- ✅ **Sorting**: Multi-column sorting with visual indicators
- ✅ **Filtering**: Global search and column-specific filters
- ✅ **Pagination**: Customizable page sizes and navigation
- ✅ **Row Selection**: Single and bulk selection with actions
- ✅ **Column Visibility**: Show/hide columns dynamically
- ✅ **Export**: CSV and JSON export functionality
- ✅ **Loading States**: Skeleton loaders and loading indicators
- ✅ **Responsive Design**: Mobile-friendly layouts
- ✅ **Accessibility**: ARIA labels and keyboard navigation

### Advanced Features
- ✅ **Fuzzy Search**: Intelligent search with ranking
- ✅ **Sticky Headers**: Fixed headers on scroll
- ✅ **Bulk Actions**: Operations on multiple selected rows
- ✅ **Action Buttons**: Consistent styling (view, edit, delete)
- ✅ **Status Badges**: Color-coded status indicators
- ✅ **Custom Cell Rendering**: Images, dates, numbers, etc.

## Architecture

```
src/
├── components/ui/
│   ├── data-table/
│   │   ├── data-table.tsx           # Main DataTable component
│   │   ├── data-table-toolbar.tsx   # Toolbar with search and actions
│   │   ├── action-button.tsx        # Consistent action buttons
│   │   ├── status-badge.tsx         # Status badges
│   │   ├── table-skeleton.tsx       # Loading skeleton
│   │   └── index.ts                 # Barrel exports
│   ├── table.tsx                    # Base table components
│   ├── button.tsx                   # Button component
│   ├── input.tsx                    # Input component
│   └── checkbox.tsx                 # Checkbox component
├── lib/utils/
│   ├── table.ts                     # Table utilities and styling
│   └── table-columns.tsx            # Column helper functions
```

## Usage

### Basic Table

```tsx
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

export function UsersTable({ data }: { data: User[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search users..."
    />
  )
}
```

### Advanced Table with All Features

```tsx
import { DataTable } from "@/components/ui/data-table"
import { 
  createSelectionColumn,
  createTextColumn,
  createStatusColumn,
  createDateColumn,
  createActionsColumn,
  commonActions
} from "@/lib/utils/table-columns"

export function ExperiencesTable({ data, loading, onRefresh }) {
  const columns = [
    createSelectionColumn<Experience>(),
    createTextColumn<Experience>("title", "Title"),
    createStatusColumn<Experience>("status", "Status"),
    createDateColumn<Experience>("created_at", "Created"),
    createActionsColumn<Experience>([
      commonActions.view(handleView),
      commonActions.edit(handleEdit),
      commonActions.delete(handleDelete),
    ]),
  ]

  const bulkActions = [
    {
      label: "Delete Selected",
      value: "delete",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      variant: "destructive" as const,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      enableSorting={true}
      enableFiltering={true}
      enableGlobalFilter={true}
      enableColumnVisibility={true}
      enableRowSelection={true}
      enableExport={true}
      onBulkAction={handleBulkAction}
      bulkActions={bulkActions}
      searchPlaceholder="Search experiences..."
      filename="experiences"
      stickyHeader={true}
    />
  )
}
```

## Column Helper Functions

### Selection Column
```tsx
createSelectionColumn<TData>()
```
Creates a checkbox column for row selection with "select all" functionality.

### Text Column
```tsx
createTextColumn<TData>(
  accessorKey: string,
  header: string,
  options?: {
    className?: string
    sortable?: boolean
    filterable?: boolean
    width?: number
  }
)
```

### Status Column
```tsx
createStatusColumn<TData>(
  accessorKey: string,
  header?: string,
  statusMap?: Record<string, StatusType>
)
```

### Date Column
```tsx
createDateColumn<TData>(
  accessorKey: string,
  header: string,
  options?: {
    format?: 'short' | 'long' | 'relative'
    className?: string
  }
)
```

### Number Column
```tsx
createNumberColumn<TData>(
  accessorKey: string,
  header: string,
  options?: {
    format?: 'currency' | 'percentage' | 'decimal'
    currency?: string
    decimals?: number
    className?: string
  }
)
```

### Actions Column
```tsx
createActionsColumn<TData>(
  actions: Array<{
    label: string
    icon: React.ReactNode
    onClick: (row: TData) => void
    variant?: ActionVariant
    show?: (row: TData) => boolean
  }>
)
```

### Image Column
```tsx
createImageColumn<TData>(
  accessorKey: string,
  header: string,
  options?: {
    size?: 'sm' | 'md' | 'lg'
    fallback?: string
    className?: string
  }
)
```

## Common Action Presets

```tsx
import { commonActions } from "@/lib/utils/table-columns"

const actions = [
  commonActions.view(handleView),      // Gray eye icon
  commonActions.edit(handleEdit),      // Blue edit icon
  commonActions.delete(handleDelete),  // Red trash icon
  commonActions.menu(handleMenu),      // Gray dots icon
]
```

## Action Button Variants

The system includes consistent action button styling:

```tsx
const variants = {
  view: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  edit: "text-blue-600 hover:text-blue-900 hover:bg-blue-50",
  delete: "text-red-600 hover:text-red-900 hover:bg-red-50",
  primary: "text-purple-600 hover:text-purple-900 hover:bg-purple-50",
  secondary: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
}
```

## Status Badge Variants

```tsx
const statusVariants = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-red-100 text-red-800",
  pending: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  success: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
}
```

## DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Required | Column definitions |
| `data` | `TData[]` | Required | Table data |
| `loading` | `boolean` | `false` | Show loading state |
| `pageSize` | `number` | `10` | Initial page size |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableFiltering` | `boolean` | `true` | Enable column filtering |
| `enableGlobalFilter` | `boolean` | `true` | Enable global search |
| `enableColumnVisibility` | `boolean` | `true` | Enable column show/hide |
| `enableRowSelection` | `boolean` | `false` | Enable row selection |
| `enableExport` | `boolean` | `false` | Enable export functionality |
| `onRowSelectionChange` | `function` | - | Row selection callback |
| `onBulkAction` | `function` | - | Bulk action callback |
| `bulkActions` | `BulkAction[]` | `[]` | Available bulk actions |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `emptyMessage` | `string` | `"No results found."` | Empty state message |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Table size variant |
| `stickyHeader` | `boolean` | `false` | Enable sticky header |
| `filename` | `string` | `'export'` | Export filename prefix |

## Responsive Design

The table system is fully responsive:

- **Mobile**: Horizontal scroll with optimized touch interactions
- **Tablet**: Improved column spacing and touch targets
- **Desktop**: Full feature set with hover states

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Semantic table structure

## Examples

### Users Table
```tsx
// src/app/admin/users/components/users-table.tsx
export function UsersTable({ data, loading }) {
  const columns = [
    createSelectionColumn<User>(),
    createTextColumn<User>("name", "Name"),
    createTextColumn<User>("email", "Email"),
    createStatusColumn<User>("status", "Status"),
    createDateColumn<User>("created_at", "Joined", { format: "relative" }),
    createActionsColumn<User>([
      commonActions.view(handleView),
      commonActions.edit(handleEdit),
    ]),
  ]

  return <DataTable columns={columns} data={data} loading={loading} />
}
```

### Orders Table
```tsx
// src/app/admin/orders/components/orders-table.tsx
export function OrdersTable({ data, loading }) {
  const columns = [
    createTextColumn<Order>("order_number", "Order #"),
    createTextColumn<Order>("customer_name", "Customer"),
    createNumberColumn<Order>("total", "Total", { format: "currency" }),
    createStatusColumn<Order>("status", "Status"),
    createDateColumn<Order>("created_at", "Date"),
    createActionsColumn<Order>([
      commonActions.view(handleView),
      {
        label: "Fulfill",
        icon: <Package className="w-4 h-4" />,
        onClick: handleFulfill,
        variant: "primary",
        show: (order) => order.status === "pending"
      }
    ]),
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      enableExport={true}
      filename="orders"
    />
  )
}
```

## Migration Guide

### From Old Table to New System

1. **Replace table markup** with `<DataTable>` component
2. **Convert columns** to use column helpers
3. **Update action buttons** to use consistent variants
4. **Add bulk actions** if needed
5. **Enable desired features** via props

### Before (Old System)
```tsx
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {data.map(item => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>
          <button onClick={() => edit(item)}>Edit</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### After (New System)
```tsx
const columns = [
  createTextColumn<Item>("name", "Name"),
  createActionsColumn<Item>([
    commonActions.edit(handleEdit)
  ])
]

<DataTable columns={columns} data={data} />
```

## Best Practices

1. **Use column helpers** for consistent styling
2. **Implement loading states** for better UX
3. **Provide meaningful empty states**
4. **Enable export for data-heavy tables**
5. **Use bulk actions** for efficiency
6. **Test accessibility** with screen readers
7. **Optimize for mobile** usage patterns

## Performance Considerations

- Use `React.memo` for heavy cell renderers
- Implement virtual scrolling for large datasets (>1000 rows)
- Lazy load data with server-side pagination
- Debounce search inputs for API calls

## Troubleshooting

### Common Issues

1. **Columns not sorting**: Ensure `enableSorting` is true
2. **Search not working**: Check `enableGlobalFilter` prop
3. **Actions not showing**: Verify action button imports
4. **Styling issues**: Confirm Tailwind classes are available

### Performance Issues

1. **Slow rendering**: Use React.memo for complex cells
2. **Memory leaks**: Clean up event listeners in useEffect
3. **Large datasets**: Implement server-side pagination

## Future Enhancements

- [ ] Virtual scrolling for large datasets
- [ ] Advanced filter builder UI
- [ ] Column resizing
- [ ] Drag-and-drop row reordering
- [ ] Export to Excel format
- [ ] Print-friendly layouts
- [ ] Dark mode support
- [ ] RTL language support

## Support

For questions or issues with the table system:

1. Check this documentation first
2. Look at existing implementations in `/app/admin/`
3. Test with the provided examples
4. Review TanStack Table documentation for advanced features 