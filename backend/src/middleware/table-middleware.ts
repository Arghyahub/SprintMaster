import { NextFunction, Request, Response } from "express";

function safeParse(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function parseTableQueryParams(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method == "GET") {
    const columnFilters = req.query?.columnFilters;
    const sorting = req.query?.sorting;
    const pagination = req.query?.pagination;
    if (columnFilters && typeof columnFilters == "string")
      req.columnFilters = safeParse(columnFilters);
    if (sorting && typeof sorting == "string") req.sorting = safeParse(sorting);
    if (pagination && typeof pagination == "string")
      req.pagination = safeParse(pagination);
  }
  next();
}

export default parseTableQueryParams;
