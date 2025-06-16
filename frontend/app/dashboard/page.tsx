import { AppSidebar } from "~/components/app-sidebar";
import { DataTable, columns, type Habit } from "~/components/data-table";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

async function getData(): Promise<Habit[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "A",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "B",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "C",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "D",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "E",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "F",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "G",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "H",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "I",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "J",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "K",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "L",
      created_at: "2016-01-01",
      user_id: "1",
    },
    {
      id: "1",
      name: "M",
      created_at: "2016-01-01",
      user_id: "1",
    },
    // ...
  ];
}

export default async function Page() {
  const data = await getData();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      {/* <SidebarTrigger className="-ml-1" /> */}
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
