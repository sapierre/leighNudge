import dayjs from "dayjs";
import { useState } from "react";
import { View } from "react-native";
import { useNativeVariable } from "react-native-css/native";
import { Pie, PolarChart } from "victory-native";

import { useTranslation } from "@turbostarter/i18n";
import { cn } from "@turbostarter/ui";
import {
  CardDescription,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@turbostarter/ui-mobile/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@turbostarter/ui-mobile/select";
import { Text } from "@turbostarter/ui-mobile/text";

const useChart = () => {
  const color1 = useNativeVariable("--chart-1") as string;
  const color2 = useNativeVariable("--chart-2") as string;
  const color3 = useNativeVariable("--chart-3") as string;
  const color4 = useNativeVariable("--chart-4") as string;
  const color5 = useNativeVariable("--chart-5") as string;

  const data = [
    { month: "may", desktop: 209, color: color5 },
    { month: "april", desktop: 173, color: color4 },
    { month: "march", desktop: 237, color: color3 },
    { month: "february", desktop: 305, color: color2 },
    { month: "january", desktop: 186, color: color1 },
  ];

  const config = {
    january: {
      label: dayjs().month(0).format("MMMM"),
      color: color1,
    },
    february: {
      label: dayjs().month(1).format("MMMM"),
      color: color2,
    },
    march: {
      label: dayjs().month(2).format("MMMM"),
      color: color3,
    },
    april: {
      label: dayjs().month(3).format("MMMM"),
      color: color4,
    },
    may: {
      label: dayjs().month(4).format("MMMM"),
      color: color5,
    },
  };

  return { data, config };
};

export function PieChart() {
  const { t, i18n } = useTranslation(["common", "dashboard"]);
  const backgroundColor = useNativeVariable("--background") as string;

  const { data, config } = useChart();
  const [activeMonth, setActiveMonth] = useState(
    data.at(-1)?.month ?? "january",
  );

  const months = data.map((item) => item.month).reverse();

  return (
    <Card className="w-full pb-2">
      <CardHeader className="flex-row items-start justify-between gap-0.5">
        <View>
          <CardTitle className="text-xl">{t("chart.pie")}</CardTitle>
          <CardDescription>{t("chart.period")}</CardDescription>
        </View>

        <Select
          value={{
            value: activeMonth,
            label: config[activeMonth as keyof typeof config].label,
          }}
          onValueChange={(option) => setActiveMonth(option?.value ?? "january")}
        >
          <SelectTrigger
            className="ml-auto rounded-lg"
            aria-label={t("selectMonth")}
            size="sm"
          >
            <View
              className="size-3 shrink-0 rounded-sm"
              style={{
                backgroundColor:
                  config[activeMonth as keyof typeof config].color,
              }}
            />
            <SelectValue
              placeholder={t("selectMonth")}
              className="text-foreground text-sm"
            />
          </SelectTrigger>
          <SelectContent align="start" className="rounded-xl" sideOffset={4}>
            {months.map((month) => {
              const monthConfig = config[month as keyof typeof config];
              return (
                <SelectItem key={month} value={month} label={monthConfig.label}>
                  <View className="flex-row items-center gap-2 text-xs">
                    <View
                      className={cn("size-3 shrink-0 rounded-sm")}
                      style={{
                        backgroundColor: monthConfig.color,
                      }}
                    />
                    <Text className="text-sm">{monthConfig.label}</Text>
                  </View>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="relative h-[250px]">
        <PolarChart
          data={data}
          labelKey="month"
          valueKey="desktop"
          colorKey="color"
        >
          <Pie.Chart innerRadius="50%">
            {({ slice }) => (
              <>
                <Pie.Slice key={slice.value} />
                {activeMonth === slice.label && (
                  <Pie.SliceAngularInset
                    angularInset={{
                      angularStrokeWidth: 8,
                      angularStrokeColor: backgroundColor,
                    }}
                  />
                )}
              </>
            )}
          </Pie.Chart>
        </PolarChart>

        <View className="absolute inset-0 items-center justify-center">
          <Text className="font-sans-bold text-foreground -mt-3 text-4xl leading-none">
            {data
              .find((data) => data.month === activeMonth)
              ?.desktop.toLocaleString(i18n.language)}
          </Text>
          <Text className="text-muted-foreground text-sm leading-none">
            {t("visitors")}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
}
