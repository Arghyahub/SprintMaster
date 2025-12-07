"use client";
import AdvInput from "@/components/common/adv-input";
import Loader from "@/components/common/loader";
import VariantBtn from "@/components/common/varitant-btn";
import useUserStore from "@/store/user-store";
import CompanyEntity from "@/types/entities/company-entity";
import Api from "@/utils/api";
import Util from "@/utils/util";
import Validator from "@/utils/validator";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {};

const defaultCompanyState = new CompanyEntity();

const sizeNumValidator = Validator.getNumericValidator({
  required: false,
  min: 0,
  max: 1e7,
  decimal: 0,
});

const page = (props: Props) => {
  const [CompanyState, setCompanyState] = useState(defaultCompanyState);
  const [IsLoading, setIsLoading] = useState(false);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const User = useUserStore((state) => state.user);

  const handleNameChange = (value: any): boolean => {
    let isValid = true;
    const copyState = { ...CompanyState };
    copyState.name = value;
    copyState.name_error = "";
    if (!Util.isNotNull(copyState.name)) {
      isValid = false;
      copyState.name_error = "Name is required";
    }
    setCompanyState(copyState);
    return isValid;
  };

  const handleAboutInput = (value: any) => {
    setCompanyState((prev) => ({ ...prev, about: value }));
  };

  const handleCompanySizeInput = (value: any): boolean => {
    const { breakOnchange, error, isValid } = sizeNumValidator(value);
    if (breakOnchange) return isValid;

    const copyState = { ...CompanyState };
    copyState.company_size_error = error;
    copyState.company_size = value;
    setCompanyState(copyState);
    return isValid;
  };

  const fetchCompany = async () => {
    try {
      setIsLoading(true);
      const res = await Api.get("/company");
      if (res.status == 500) {
        toast.error(
          res.data?.error ?? "Server error while fetching company data."
        );
        return;
      } else if (res.data?.payload) {
        const company = res.data.payload as CompanyEntity;
        setCompanyState(company);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error(error?.message || "Failed to fetch company data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = [
      handleNameChange(CompanyState.name),
      handleCompanySizeInput(CompanyState.company_size),
    ].every(Boolean);

    if (!isValid) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: CompanyState.name,
        company_size: Util.isNotNull(CompanyState.company_size)
          ? Number(CompanyState.company_size)
          : null,
        about: CompanyState.about,
      };
      const res = await Api.post("/company/add-update", payload);
      if (res.status == 500) {
        toast.error(
          res.data?.error ?? "Server error while submitting company data."
        );
        return;
      } else if (res.status == 200) {
        toast.success("Company setup completed successfully.");
        // Redirect to home
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error submitting company data:", error);
      toast.error(error?.message || "Failed to submit company data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (User?.company_id) {
      fetchCompany();
    }
  }, [User]);

  if (IsLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-3xl mb-2">Company Setup</h1>
      <div className="flex flex-row gap-4 w-full">
        <AdvInput
          label="Name *"
          value={CompanyState.name}
          error={CompanyState.name_error}
          placeholder="Enter company name"
          id="name"
          onChange={(e) => handleNameChange(e.target.value)}
          maxLength={100}
          layoutClassName="w-full"
        />
        <AdvInput
          label="Company Size"
          error={CompanyState.company_size_error}
          id="company_size"
          value={CompanyState.company_size}
          placeholder="Optional"
          onChange={(e) => handleCompanySizeInput(e.target.value)}
          layoutClassName="w-full"
        />
      </div>
      <AdvInput
        label="About"
        placeholder="Optional"
        value={CompanyState.about}
        error={CompanyState.about_error}
        id="about"
        type="text-area"
        onChange={(e) => handleAboutInput(e.target.value)}
      />

      <VariantBtn
        onClick={handleSubmit}
        label="Submit"
        isLoading={IsSubmitting}
        classname="max-w-20 ml-auto mt-2"
      />
    </div>
  );
};

export default page;
