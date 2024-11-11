export function PageTitle({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <h1 className="text-3xl font-extralight p-2" {...props}>
      {children}
    </h1>
  );
}
