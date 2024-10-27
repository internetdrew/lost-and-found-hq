const Spinner = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-600'></div>
      </div>
    </div>
  );
};

export default Spinner;
