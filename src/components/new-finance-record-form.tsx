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
import { DecimalInput } from "@/components/ui/decimal-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { createRecord } from "@/db";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  asset: z.string().min(2, {
    message: "El título debe tener al menos 2 caracteres.",
  }),
  shares: z.number().min(0, {
    message: "El número de acciones debe ser positivo.",
  }),
  price: z.number().min(0, {
    message: "El precio debe ser positivo.",
  }),
  currency: z.string({
    required_error: "Por favor selecciona una moneda.",
  }),
  note: z.string().optional(),
});

export function NewFinanceRecordFormComponent() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();
  const editingAsset = searchParams.get("asset") || "";
  const editingShares = searchParams.get("shares") || 0;

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
      asset: editingAsset,
      shares: Number(editingShares),
      price: 0,
      currency: "COP",
      note: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isUserLoaded || !userId) return;

    setLoading(true);
    try {
      await createRecord(supabase, {
        asset: values.asset,
        shares: values.shares,
        currency: values.currency,
        price: values.price,
        note: values.note,
        user_id: userId,
      });

      // Invalidate React Query cache to refetch data
      queryClient.invalidateQueries({ queryKey: ["user-records", userId] });
      queryClient.invalidateQueries({ queryKey: ["assets-history", userId] });

      setError("");
      toast.success("Registro creado con éxito");
      form.reset();

      setTimeout(() => (window.location.href = "/?tab=home"), 200);
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
          name="asset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Acciones de Apple" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shares</FormLabel>
              <FormControl>
                <DecimalInput
                  maxDecimals={16}
                  placeholder="0"
                  {...field}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <DecimalInput
                  maxDecimals={16}
                  placeholder="0"
                  {...field}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Añade cualquier nota adicional aquí"
                  {...field}
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
