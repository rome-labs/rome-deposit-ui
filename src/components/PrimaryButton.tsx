export const PrimaryButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="shadow-btn bg-white rounded-2xl px-5 py-2.5 flex items-center gap-2 cursor-pointer text-base text-primary hover:font-semibold justify-center mb-4">
      {children}
    </button>
  );
};
