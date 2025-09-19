import React from 'react'

const SensorCard = ({label, Icon, data,  alertText}) => {
    return (
        <div className="rounded-2xl border bg-green-50 border-green-200 p-6 w-full max-w-sm shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-green-900">{label}</h2>
                <Icon size = {25}/>
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">{data}</div>
            {alertText && (
                <div className="text-sm text-orange-300 font-medium">{alertText}</div>
            )}
        </div>
    )
}

export default SensorCard