// we will code three types of loading animations

// Animation for buttons used in Login and Verify pages when user clicks on submit button and waiting for response from server
export const LoadingSpinner = () => {
  return (
    <>
      <div
        className="inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"
      ></div>
    </>
  );
};

// Animation for page loading 

export const LoadingBig = () => {
return (
    <>
        <div className="flex space-x-2 justify-center items-center w-[200px] m-auto mt-[300px]">
            <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.6s' }}></div>
            <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
            <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        </div>
    </>
);
};

// animation for small loading like in chat input when user is typing
export const LoadingSmall = () =>
{

    return(
        <>
        <div className="flex space-x-2 justify-center items-center">
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.6s' }}></div>
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
            <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        </div>
        
        
        </>
    );
}