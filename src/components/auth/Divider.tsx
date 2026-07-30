const Divider = () => {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-200" />

      <span className="text-sm font-medium text-gray-400">
        OR
      </span>

      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
};

export default Divider;