import dayjs from "dayjs";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

function DueDateInput() {
  const { control } = useFormContext();

  const formatDueDate = (text: string) => {
    if (text.length === 4) return text + "-";
    else if (text.length === 7) return text + "-";
    else return text;
  };

  return (
    <Controller
      name="dueDate"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length === 0) return "필수 입력 항목";
          const today = dayjs();
          if (dayjs(data).isBefore(today)) return "잘못된 출산예정일 입니다";
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          label="출산예정일"
          placeholder="YYYY - MM - DD"
          inputMode="numeric"
          value={value}
          onChangeText={(text) => {
            const formatted = formatDueDate(text);
            onChange(formatted);
          }}
          onFocus={() => {
            onChange("");
          }}
          error={error?.message}
          maxLength={10}
          size="small"
        />
      )}
    />
  );
}

export default DueDateInput;
