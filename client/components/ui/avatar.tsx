import React from 'react'

function Avatar() {
    return (
        <div className='mx-4 pt-[1.7rem]'>
            <div id="tooltip-bonnie" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Bonnie Green
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
            <img data-tooltip-target="tooltip-bonnie" className="w-10 h-10 rounded" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="Medium avatar" />
        </div>
    )
}

export default Avatar