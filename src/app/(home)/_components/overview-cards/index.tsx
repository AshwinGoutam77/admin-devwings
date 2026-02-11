import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { views, profit, products, users } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      <OverviewCard
        label="Total Contacts"
        data={{
          ...views,
          value: compactFormat(views.value),
          growthRate: views.growth,
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Career Applications"
        data={{
          ...products,
          value: compactFormat(products.value),
          growthRate: products.growth,
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Estimates"
        data={{
          ...users,
          value: compactFormat(users.value),
          growthRate: users.growth,
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
