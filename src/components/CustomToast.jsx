// components/CustomToast.jsx
import toast from 'react-hot-toast';

export const showUserToast = (user) => {
  toast.custom((t) => (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-2xl rounded-lg pointer-events-auto flex `}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className="h-10 w-10 rounded-full"
              src={user.profilePicture || '/default-profile.png'}
              alt={user.name}
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user.name}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              EMR updated successfully!
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border cursor-pointer border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-500 "
        >
          Close
        </button>
      </div>
    </div>
  ));
};


export const showWelcomeToast = (userName) => {
  toast.custom((t) => (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-blue-50 border border-blue-200 shadow-lg rounded-lg pointer-events-auto flex`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className="h-10 w-10 rounded-full"
              src="/star.svg" // Add an Ayra bot image or use default
              alt="Ayra Assistant"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Welcome,{userName}!
            </p>
            <p className="mt-1 text-sm text-gray-600">
              I am your medical assistant Ayra. How can I help you today?
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-blue-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border cursor-pointer border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  ), {
    duration: 6000, // Longer duration for welcome message
  });
};