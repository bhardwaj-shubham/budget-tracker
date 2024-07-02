import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeltonTable() {
  return Array(3)
    .fill(0)
    .map((_, id) => (
      <TableRow key={id}>
        <TableCell className="font-medium">
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4" />
        </TableCell>
      </TableRow>
    ));
}
