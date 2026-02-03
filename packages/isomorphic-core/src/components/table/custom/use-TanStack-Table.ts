"use client";

import {
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  RowPinningState,
  SortingState,
  TableOptions,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

interface ExtendTableOptions<T extends Record<string, unknown>>
  extends Omit<TableOptions<T>, "data" | "columns" | "getCoreRowModel"> {
  state?: {
    sorting?: SortingState;
    pagination?: PaginationState;
    columnFilters?: ColumnFiltersState;
    columnOrder?: string[];
    expanded?: ExpandedState;
    rowPinning?: RowPinningState;
    globalFilter?: string;
  };
  onPaginationChange?: OnChangeFn<PaginationState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  onRowPinningChange?: OnChangeFn<RowPinningState>;
  onColumnOrderChange?: OnChangeFn<string[]>;
  onGlobalFilterChange?: OnChangeFn<string>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
}

export function useTanStackTable<T extends Record<string, any>>({
  options,
  tableData,
  columnConfig,
  pagination,
}: {
  tableData: T[] | any;
  options?: ExtendTableOptions<T>;
  columnConfig: ColumnDef<T, any>[];
  pagination?: PaginationState;
}) {
  const [data, setDataInternal] = React.useState<T[]>([...(tableData ?? [])]);
  
  // Wrapper to ensure proper type inference in callbacks
  const setData = React.useCallback(
    (updater: T[] | ((prev: T[]) => T[])) => {
      setDataInternal(updater);
    },
    []
  );
  const [columns] = React.useState(() => [...columnConfig]);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!)
  );

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  // ✅ FIX: Always keep pagination defined
  const [localPagination, setLocalPagination] = React.useState<PaginationState>(
    pagination ?? { pageIndex: 0, pageSize: 10 }
  );

  // ✅ Keep in sync when parent changes pagination
  React.useEffect(() => {
    if (pagination) {
      setLocalPagination(pagination);
    }
  }, [pagination?.pageIndex, pagination?.pageSize]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((item) => item?.id).filter(Boolean),
    [data]
  );

  const handleDragEndColumn = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arraySwap(columnOrder, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDragEndRow = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = prevData.findIndex((item) => item.id === active.id);
        const newIndex = prevData.findIndex((item) => item.id === over.id);
        return arraySwap(prevData, oldIndex, newIndex);
      });
    }
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      pagination: localPagination, // ✅ ALWAYS defined now
      expanded,
      rowPinning,
      columnOrder,
      globalFilter,
      columnFilters,
      ...(options?.state ?? {}),
    },

    // ✅ IMPORTANT: keep pagination working
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(localPagination) : updater;

      setLocalPagination(next);

      // forward to parent if they use server pagination
      options?.onPaginationChange?.(updater);
    },

    ...options,

    getRowCanExpand: () => true,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onRowPinningChange: setRowPinning,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return {
    table,
    dataIds,
    setData,
    sensors,
    tableData: data,
    rowPinning,
    columnOrder,
    globalFilter,
    setRowPinning,
    setColumnOrder,
    setGlobalFilter,
    handleDragEndRow,
    handleDragEndColumn,
  };
}
