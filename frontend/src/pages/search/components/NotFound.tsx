const NotFound = () => {
  return (
    <>
      <main className="grid min-h-full place-items-cente px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-600 sm:text-7xl">
            Not found any songs or artists.
          </h1>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              Quay lại trang chủ
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
