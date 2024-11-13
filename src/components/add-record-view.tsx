import { NewFinanceRecordFormComponent } from "./new-finance-record-form";
import { PageTitle } from "./ui/page-title";

export function AddRecordView() {
  return (
    <div className="flex flex-col max-w-xl m-auto">
      <PageTitle>CREATE ASSET</PageTitle>
      <div>
        <NewFinanceRecordFormComponent />
      </div>
    </div>
  );
}
