"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { MapPin, CalendarDays, Users, Search } from "lucide-react";
import { searchFormSchema, SearchFormValues } from "@/lib/validations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
export default function SearchForm() {
  const router = useRouter();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      destination: "",
      guests: 1,
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    const params = new URLSearchParams({
      destination: values.destination,
      checkIn: values.checkIn.toISOString().split("T")[0],
      checkOut: values.checkOut.toISOString().split("T")[0],
      guests: String(values.guests),
    });
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-5 sm:p-7 bg-white rounded-2xl shadow-2xl shadow-blue-950/10 border border-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_0.8fr_auto] gap-4 md:gap-3 items-end"
        >
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-gold-500" />
                  Destination
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="City, hotel, or country"
                    className="h-12 border-gray-200 focus-visible:ring-blue-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500">
                  <CalendarDays className="h-3.5 w-3.5 text-gold-500" />
                  Check-in
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="h-12 border-gray-200 focus-visible:ring-blue-600"
                    onChange={(e) => field.onChange(e.target.valueAsDate)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500">
                  <CalendarDays className="h-3.5 w-3.5 text-gold-500" />
                  Check-out
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="h-12 border-gray-200 focus-visible:ring-blue-600"
                    onChange={(e) => field.onChange(e.target.valueAsDate)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500">
                  <Users className="h-3.5 w-3.5 text-gold-500" />
                  Guests
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    className="h-12 border-gray-200 focus-visible:ring-blue-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full md:w-auto px-6 bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-700/20"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </Form>
    </div>
  );
}
