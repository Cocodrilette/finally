export function ExpensesView({ loading }: { loading: boolean }) {
  return (
    <div className="flex flex-col gap-5 border-t pt-2">
      <h2 className="font-mono">{">"} Expenses</h2>
      <div>
        {loading ? (
          <ul className="flex flex-wrap gap-2">
            {Array.from({ length: 1 }).map((_, index) => (
              <p></p>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
