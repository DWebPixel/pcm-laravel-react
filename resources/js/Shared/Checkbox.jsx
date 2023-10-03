import React from 'react';

export default function Checkbox({ name, value, handleChange, disabled }) {
    return (
        <input
            type="checkbox"
            name={name}
            value={value}
            className="rounded border-gray-400 text-indigo-600 shadow-sm focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-100"
            onChange={(e) => handleChange(e)}
            checked={value}
            disabled={disabled}
        />
    );
}
