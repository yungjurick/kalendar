import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const UserProfileModal = ({
  onCloseUserProfile
}) => {
  const profileRef = useRef(null);
  const { push } = useRouter();
  const currentUser = useSelector(({ user }) => user)

  const handleLogout = () => push('/');

  useEffect(() => {
    const checkOutsideClick = (e) => {
      if (profileRef && profileRef.current) {
        const outsideClick = !profileRef.current.contains(e.target);
        if (outsideClick) {
          onCloseUserProfile();
        }
      }
    }

    document.addEventListener('click', checkOutsideClick)

    return () => {
      document.removeEventListener('click', checkOutsideClick);
    }
  }, [profileRef, onCloseUserProfile])

  return (
    <div
      ref={profileRef}
      className="absolute z-20 flex flex-col justify-center bg-white border rounded-md shadow-lg w-96 right-1 top-14"
    >
      <div className="flex flex-col items-center justify-center px-6 py-5">
        <Image
          src={currentUser.photoUrl}
          height="80px"
          width="80px"
          alt="profile"
          className="rounded-full"
        />
        <p className="mt-2 font-bold tracking-medium">
          {currentUser.displayName}
        </p>
        <p className="text-sm text-gray-500">
          {currentUser.email}
        </p>
      </div>
      <div className="flex items-center justify-center border-t">
        <div
          onClick={() => handleLogout()}
          className="px-6 py-2 my-4 text-sm font-normal border rounded-md cursor-pointer hover:bg-gray-100"
        >
          Logout
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal;