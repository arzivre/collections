"use client";

import * as React from "react";
import { Checkbox } from "../ui/checkbox";

export default function MultiselectDropdown({
  listArr,
}: {
  listArr: string[];
}) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<Array<string>>([]);

  function toggleShowDropdown() {
    setShowDropdown((prevState) => !prevState);
  }
  return (
    <fieldset className="relative border-none">
      <button
        type="button"
        onClick={toggleShowDropdown}
        className="flex h-10 w-[200px] items-center bg-white px-4 text-gray-950"
      >
        {selectedValue.length > 0 ? selectedValue.join(", ") : "Select"}
      </button>
      {showDropdown ? (
        <div className="absolute mt-4 flex w-[300px] flex-col space-y-2 bg-white p-3 text-gray-950">
          {listArr.map((name) => (
            <div key={name} className="flex items-center space-x-2">
              <Checkbox
                id={name}
                checked={selectedValue?.includes(name)}
                onCheckedChange={(checked) => {
                  return checked
                    ? setSelectedValue([...selectedValue, name])
                    : setSelectedValue(
                        selectedValue?.filter((value) => value !== name),
                      );
                }}
              />
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none 
                peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {name}
              </label>
            </div>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}
