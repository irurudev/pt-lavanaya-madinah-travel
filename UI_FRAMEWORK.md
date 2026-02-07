# UI Framework - Chakra UI

## Framework yang Digunakan

Aplikasi **MySmartWarehouse** menggunakan **Chakra UI v3** sebagai UI framework utama.

### Dependencies

```json
{
  "@chakra-ui/react": "latest",
  "@emotion/react": "latest",
  "@emotion/styled": "latest",
  "framer-motion": "latest",
  "react-icons": "latest"
}
```

## Komponen Chakra UI yang Digunakan

### Layout Components
- **Box** - Container dengan property CSS yang fleksibel
- **Flex** - Flexbox container
- **Stack** - Vertical/horizontal stack dengan gap
- **Grid** - CSS Grid layout
- **Container** - Centered container dengan max-width
- **Center** - Centering wrapper

### Data Display
- **Table** - Table.Root, Table.Header, Table.Row, Table.Cell, Table.ColumnHeader
- **Card** - Card.Root, Card.Header, Card.Body, Card.Footer
- **Badge** - Label dengan color variants
- **Stat** - Statistics display dengan Stat.Root, Stat.Label, Stat.ValueText

### Feedback
- **Alert** - Alert.Root, Alert.Indicator, Alert.Title, Alert.Description
- **Spinner** - Loading indicator
- **Toast** - Notification (planned)

### Form Components
- **Input** - Text input dengan size variants (sm, md, lg)
- **Button** - Button dengan colorPalette dan loading state
- **NativeSelect** - Custom select dropdown component
- **Textarea** - Multiline text input

### Typography
- **Heading** - Heading dengan size variants (xs, sm, md, lg, xl, 2xl)
- **Text** - Text dengan fontSize, fontWeight, color props

## Color Palette

**Primary**: `teal` (teal.500, teal.600, teal.700)
- Digunakan untuk navbar, primary buttons, links

**Secondary**: `gray` (gray.50, gray.100, gray.600)
- Background, borders, muted text

**Status Colors**:
- Success: `green` (green.500)
- Warning: `orange` (orange.500)
- Error: `red` (red.500)
- Info: `blue` (blue.500)

## Custom Components

### NativeSelect
Location: `resources/js/components/ui/native-select.tsx`

Custom select component yang terintegrasi dengan Chakra UI theme.

```tsx
import { NativeSelect } from '@/components/ui/native-select';

<NativeSelect size="lg" placeholder="Pilih kategori">
  <option value="1">Elektronik</option>
  <option value="2">Furniture</option>
</NativeSelect>
```

## Design Patterns

### Page Structure
```tsx
<WarehouseLayout>
  <Stack gap={6}>
    <Heading size="2xl">Page Title</Heading>
    {/* Content */}
  </Stack>
</WarehouseLayout>
```

### Card Pattern
```tsx
<Card.Root>
  <Card.Header>
    <Heading size="lg">Card Title</Heading>
  </Card.Header>
  <Card.Body>
    {/* Content */}
  </Card.Body>
  <Card.Footer>
    {/* Actions */}
  </Card.Footer>
</Card.Root>
```

### Table Pattern
```tsx
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Column 1</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Data</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### Form Pattern
```tsx
<Stack gap={4}>
  <Box>
    <Text mb={2} fontWeight="medium">Label</Text>
    <Input size="lg" placeholder="Enter value" />
  </Box>
  
  <Button colorPalette="teal" width="full" size="lg">
    Submit
  </Button>
</Stack>
```

## Icons

Menggunakan **react-icons** library, specifically `react-icons/fi` (Feather Icons).

Common icons:
- `FiPackage` - Package/warehouse
- `FiHome` - Home/dashboard
- `FiTag` - Category
- `FiBox` - Product
- `FiActivity` - Transaction/activity
- `FiPlus` - Add/create
- `FiEdit2` - Edit
- `FiTrash2` - Delete
- `FiSearch` - Search
- `FiAlertTriangle` - Warning

## Responsive Design

Chakra UI menggunakan breakpoints:
- `base`: 0em (mobile)
- `sm`: 30em (480px)
- `md`: 48em (768px)
- `lg`: 62em (992px)
- `xl`: 80em (1280px)
- `2xl`: 96em (1536px)

Contoh penggunaan:
```tsx
<Grid 
  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} 
  gap={4}
>
  {/* Content */}
</Grid>
```

## Provider Setup

File: `resources/js/app.tsx`

```tsx
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

root.render(
  <ChakraProvider value={defaultSystem}>
    <App {...props} />
  </ChakraProvider>
);
```

## Resources

- Documentation: https://www.chakra-ui.com/
- Components: https://www.chakra-ui.com/docs/components
- Icons: https://react-icons.github.io/react-icons/
