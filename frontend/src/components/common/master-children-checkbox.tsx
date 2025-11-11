import React from "react";

type CheckBoxIpType = { id: any; label: string; isChecked: boolean };

type Props = {
  master: CheckBoxIpType;
  children: CheckBoxIpType[];
  onChange: (master: CheckBoxIpType, children: CheckBoxIpType[]) => any;
};

const MasterChildrenCheckbox = ({ master, children, onChange }: Props) => {
  function checkMaster(isChecked: boolean) {
    const masterCopy = { ...master },
      childrenCopy = { ...children };

    masterCopy.isChecked = isChecked;
    childrenCopy.forEach((child) => {
      child.isChecked = isChecked;
    });

    onChange(masterCopy, childrenCopy);
  }

  function checkChildren(id: any, isChecked: boolean) {
    let anyChildChecked = false;
    const childrenCopy = children.map((child) => {
      if (child.id == id) child.isChecked = isChecked;

      anyChildChecked = anyChildChecked && child.isChecked;
      return child;
    });

    const masterCopy = { ...master };
    masterCopy.isChecked = anyChildChecked;

    onChange(masterCopy, childrenCopy);
  }

  return (
    <div className="flex flex-row w-full px-4 py-2 border border-b-2">
      <label key={master.id}>
        <input
          type="checkbox"
          checked={master.isChecked}
          onChange={(e) => checkMaster(e.target.checked)}
        />
        <p className="text-lg">{master.label}</p>
      </label>

      <div className="flex flex-row mt-2 gap-4">
        {children?.map((child) => (
          <label key={child.id}>
            <input
              type="checkbox"
              checked={child.isChecked}
              onChange={(e) => checkChildren(child.id, e.target.checked)}
            />
            <p>{child.label}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MasterChildrenCheckbox;
