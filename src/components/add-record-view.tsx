import { NewFinanceRecordFormComponent } from "./new-finance-record-form";
import { PageTitle } from "./ui/page-title";

export function AddRecordView() {
  return (
    <div>
      <PageTitle>ADD NEW RECORD</PageTitle>
      <NewFinanceRecordFormComponent />
    </div>
  );
}
