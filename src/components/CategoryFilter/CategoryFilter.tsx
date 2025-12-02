import React from "react";

interface Props {
  categories: string[];
  value: string;
  onChange: (v: string) => void;
}

export default function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 8, fontSize: 14 }}
      >
        <option value="all">Все категории</option>

        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
