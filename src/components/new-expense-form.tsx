"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSearchParams } from "next/navigation";
import { createExpense } from "@/db";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  expense: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  value: z.number().min(0, {
    message: "El precio valor ser positivo.",
  }),
  currency: z.string({
    required_error: "Por favor selecciona una moneda.",
  }),
  payment_day: z.number().optional(),
  type: z.string({
    required_error: "Por favor selecciona un tipo.",
  }),
});

export function NewExpenseRecordFormComponent() {
  const searchParams = useSearchParams();
  const expense = searchParams.get("expense") || "";
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      setIsUserLoaded(true);
    };

    getUser();
  }, [supabase]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expense: expense,
      value: 0,
      currency: "COP",
      payment_day: 0,
      type: "fixed",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isUserLoaded || !userId) return;

    setLoading(true);
    try {
      console.log("values", values);
      await createExpense({
        clerk_id: userId,
        currency: values.currency,
        expense: values.expense,
        payment_day: values.payment_day,
        type: values.type,
        value: values.value,
      });

      setError("");
      toast.success("Gasto creado con éxito");
      form.reset();
    } catch (error) {
      setError((error as Error).message);
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-2 max-w-xl m-auto"
      >
        <FormField
          control={form.control}
          name="expense"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Netflix" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  {...field}
                  value={field.value === 0 ? "" : field.value}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una moneda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="COP">COP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de gasto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fixed">Fijo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia de pago</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  max="31"
                  placeholder="15"
                  {...field}
                  value={field.value === 0 ? "" : field.value}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
        <p>{error && <span className="text-red-500">Error: {error}</span>}</p>
      </form>
    </Form>
  );
}
