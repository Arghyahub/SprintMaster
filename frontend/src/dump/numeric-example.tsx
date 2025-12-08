"use client";
import Util from "@/utils/util";
import Validator from "@/utils/validator";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {};

const numValidator = Validator.getNumericValidator({
  decimal: 2,
  required: true,
  max: 100,
});

const page = (props: Props) => {
  const [Err, setErr] = useState("");
  const [NumberIp, setNumberIp] = useState("");

  function handleNumOnChange(value: string) {
    const { breakOnchange, error } = numValidator(value);
    if (breakOnchange) return;
    setErr(error);
    setNumberIp(value?.trim());
  }

  function handleSubmit() {
    const { error, isValid } = numValidator(NumberIp);
    if (!isValid) {
      setErr(error?.length > 0 ? error : "Invalid Input");
      return;
    }

    alert("Great Job");
  }

  function ApiCall() {
    const dbValue = "9999";
    const { isValid } = numValidator(dbValue);
    setNumberIp(isValid ? dbValue : "");
  }

  useEffect(() => {
    if (Util.isOnServer()) return;
    ApiCall();
  }, []);

  return (
    <div className="p-20">
      {Err?.length > 0 && <p className="text-red-500">{Err}</p>}
      <div className="flex flex-row gap-4">
        <input
          type="text"
          value={NumberIp}
          onChange={(e) => handleNumOnChange(e?.target?.value)}
          className="p-2 border-2 border-black"
        />
        <button
          className="bg-purple-600 px-2 py-1 rounded-md text-white text-sm cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default page;
