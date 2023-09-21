import { getGraphRevenue } from "@/actions/getGraphRevenue";
import { getSalesCount } from "@/actions/getSalesCount";
import { getStockCount } from "@/actions/getStockCount";
import { getTotalRevenue } from "@/actions/getTotalRevenue";
import { Overview } from "@/components/Overview";
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { priceFormatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";



type Props = {
  params: {
    storeId: string;
  };
};

const DashboardPage = async ({
  params: { storeId }
}: Props) => {
  const totalRevenue = await getTotalRevenue(storeId);
  const graphRevenue = await getGraphRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);

  const cardsData = [
    {
      header: {
        title: "Total Revenue",
        icon: <DollarSign className="w-4 h-4 text-muted-foreground" />
      },
      content: priceFormatter(totalRevenue)
    },
    {
      header: {
        title: "Sales",
        icon: <CreditCard className="w-4 h-4 text-muted-foreground" />
      },
      content: `+${salesCount}`
    },
    {
      header: {
        title: "Products In Stock",
        icon: <Package className="w-4 h-4 text-muted-foreground" />
      },
      content: stockCount
    },
  ]

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          {
            cardsData.map(({ content, header: { icon, title } }, idx) => (
              <Card key={`${idx}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {title}
                  </CardTitle>
                  {icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{content}</div>
                </CardContent>
              </Card>
            ))
          }

        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;