import { NewExpenseRecordFormComponent } from "./new-expense-form";
import { PageTitle } from "./ui/page-title";

export function AddExpenseView() {
  return (
    <div className="flex flex-col max-w-xl m-auto">
      <PageTitle>CREATE EXPENSE</PageTitle>
      <div>
        <NewExpenseRecordFormComponent />
      </div>
    </div>
  );
}
