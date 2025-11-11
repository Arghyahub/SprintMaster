"use client";
import React, { useRef, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/table-core";

type Props = {
  rowCount?: number;
  columnFilters?: ColumnFiltersState;
  pagination?: PaginationState;
  sorting?: SortingState;
  isLoading?: boolean;
  isRefetching?: boolean;
};

const useTableStateManager = (prop?: Props) => {
  const [rowCount, setRowCount] = useState(prop?.rowCount ?? 0);
  const [columnFilters, setColumnFilters] = useState(prop?.columnFilters ?? []);
  const [pagination, setPagination] = useState<PaginationState>(
    prop?.pagination ?? { pageIndex: 0, pageSize: 50 }
  );
  const [sorting, setSorting] = useState<SortingState>(prop?.sorting ?? []);
  const [isLoading, setIsLoading] = useState(prop?.isLoading ?? false);
  const [isRefetching, setIsRefetching] = useState(prop?.isRefetching ?? false);
  const firstLoad = useRef(true);

  function initTableLoader() {
    if (firstLoad.current) setIsLoading(true);
    else setIsRefetching(true);
  }
  function endTableLoader() {
    if (firstLoad.current) setIsLoading(false);
    else setIsRefetching(false);
    firstLoad.current = false;
  }

  return {
    rowCount,
    setRowCount,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    sorting,
    setSorting,
    isLoading,
    setIsLoading,
    isRefetching,
    setIsRefetching,
    initTableLoader,
    endTableLoader,
  };
};

export default useTableStateManager;
