import React from 'react'

const Info = () => {
  return (
    <section className="flex items-center justify-center flex-col">
      <div className="px-6 lg:px-20 3xl:px-0 mx-auto max-w-[900px]; w-full pb-16 md:pt-52 md:pb-32">
        <p className="uppercase -mt-1 mb-3 text-center">
          About
        </p>
        <div className="flex flex-wrap justify-between gap-5 lg:gap-10">
          <h2 className=" xl:max-w-[390px]">Guide You to Easy Path</h2>
          <p className=" text-gray-30 xl:max-w-[520px]">Only with the hilink application you will no longer get lost and get lost again, because we already support offline maps when there is no internet connection in the field. Invite your friends, relatives and friends to have fun in the wilderness through the valley and reach the top of the mountain</p>
        </div>
      </div>
    </section>
  )
}

export default Info