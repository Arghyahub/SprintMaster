"use client";
import React, { memo, useMemo } from "react";
import {
  MaterialReactTable,
  MRT_ActionMenuItem,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/table-core";
import { useDebouncedCallback } from "use-debounce";

export type ActionsMenuType<T> = {
  id: string | number;
  label: string;
  icon: any;
  hideMenuCb?: (row: T) => boolean;
  callback: (row: T) => any;
}[];

type Props = {
  columns: MRT_ColumnDef<any>[];
  data: any[];
  rowCount: number;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  isLoading?: boolean;
  isRefetching?: boolean;
  actionsMenu?: ActionsMenuType<any>;
};

const MRTable = ({
  columns,
  data,
  rowCount,
  columnFilters,
  setColumnFilters,
  pagination,
  setPagination,
  sorting,
  setSorting,
  isLoading = false,
  isRefetching = false,
  actionsMenu,
}: Props) => {
  const setDebouncedFilters = useDebouncedCallback((value) => {
    setColumnFilters(value);
  }, 100);

  const getVisibleMenuItems = useMemo(() => {
    return (row: any) =>
      actionsMenu.filter((item) => !(item.hideMenuCb?.(row.original) ?? false));
  }, [actionsMenu]);

  const showActionMenu = useMemo(() => {
    if (!actionsMenu?.length) return false;
    if (!Array.isArray(data)) return false;
    return data?.some((row) =>
      actionsMenu.some((item) => !(item.hideMenuCb?.(row) ?? false))
    );
  }, [actionsMenu, data]);

  const table = useMaterialReactTable({
    columns,
    data,
    muiTableBodyCellProps: { sx: { overflow: "visible" } },
    enableClickToCopy: true,
    enableGlobalFilter: false,
    enableRowSelection: true,
    getRowId: (row) => (row as any).phoneNumber,
    initialState: { showColumnFilters: false },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableRowActions: showActionMenu,
    // onColumnFiltersChange: setColumnFilters,
    onColumnFiltersChange: (updater) => {
      const existingFilters = table.getState().columnFilters;
      // Resolve updater to actual array
      const newFilters =
        typeof updater === "function"
          ? updater(table.getState().columnFilters)
          : updater;

      const detailedFilters = newFilters.map((f) => {
        const col = columns.find((c) => c.accessorKey === f.id);
        return {
          ...f,
          meta: col?.meta,
        };
      });

      if (detailedFilters?.length == 0 && existingFilters.length == 0) return;

      setDebouncedFilters(detailedFilters);
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      isLoading,
      pagination,
      showAlertBanner: false,
      showProgressBars: isRefetching,
      sorting,
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    ...(showActionMenu && {
      renderRowActionMenuItems: ({ closeMenu, row }) => {
        const visibleItems = getVisibleMenuItems(row);
        return visibleItems.map((item) => (
          <MRT_ActionMenuItem
            icon={item.icon}
            key={item.id}
            label={item.label}
            onClick={() => {
              item.callback(row.original);
              closeMenu();
            }}
            table={table}
            sx={{
              fontSize: 15,
            }}
          />
        ));
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: "500px", // Set your desired max height here
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default MRTable;
