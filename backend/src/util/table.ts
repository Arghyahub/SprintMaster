import { Request } from "express";
import Util from "./utils";

class TableUtil {
  static getTableFilters(req: Request) {
    let ANDCondition = [],
      order = undefined,
      take = 50,
      skip = 0;

    if (Array.isArray(req?.columnFilters)) {
      for (const fltr of req.columnFilters) {
        const id = fltr?.id,
          value = fltr?.value,
          meta = fltr?.meta;

        if ((Util.isNotNull(id), Util.isNotNull(meta))) {
          let cond;
          if (meta?.num)
            cond = Util.buildNestedObjectFromString(id, Number(value));
          else if (meta?.eq) cond = Util.buildNestedObjectFromString(id, value);
          else if (meta?.text)
            cond = Util.buildNestedObjectFromString(id, {
              contains: value,
              mode: "insensitive",
            });
          else if (meta?.multi)
            cond = Util.buildNestedObjectFromString(id, { in: value });
          else continue;
          ANDCondition.push(cond);
        }
      }
    }
    if (Array.isArray(req?.sorting) && req?.sorting.length > 0) {
      const id = req?.sorting?.[0]?.id,
        isDesc = req?.sorting?.[0]?.desc;

      if (Util.isNotNull(id) && Util.isNotNull(isDesc))
        order = { id: isDesc ? "desc" : "asc" };
    }

    const pagination = req?.pagination;
    if (
      Number.isInteger(pagination?.pageIndex) &&
      Number.isInteger(pagination?.pageSize)
    ) {
      take = pagination.pageSize;
      skip = pagination.pageIndex * pagination.pageSize;
    }

    return { ANDCondition, order, take, skip };
  }
}

export default TableUtil;
