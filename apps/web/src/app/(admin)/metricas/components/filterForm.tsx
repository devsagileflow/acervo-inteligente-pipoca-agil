"use client";

import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UseFilterFormResult } from "./useFilterForm";
import { EMPTY_VALUE } from "./types";

const formatDateInput = (dateString?: string) => {
  if (!dateString) return "";
  const date = parseISO(dateString);
  return isValid(date) ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "";
};

const toISODate = (date?: Date) => (date && isValid(date) ? format(date, "yyyy-MM-dd") : undefined);

export const FilterForm = ({
  useFilterFormResult,
}: {
  useFilterFormResult: UseFilterFormResult;
}) => {
  const {
    form,
    isPending,
    startTransition,
    filters,
    minDateCalendar,
    setMinDateCalendar,
    maxDateCalendar,
    setMaxDateCalendar,
    handleClearFilters,
  } = useFilterFormResult;

  return (
    <form
      className="grid grid-cols-1 gap-4 place-self-center sm:grid-cols-2"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* <div className="space-y-2">
        <Label htmlFor="eventName">Evento</Label>
        <Select
          value={filters.eventName ?? ""}
          onValueChange={(value) =>
            startTransition(() => form.setValue("eventName", value || undefined))
          }
          disabled={isPending}
        >
          <SelectTrigger id="eventName">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Evento</SelectLabel>
              <SelectItem value="">Todos</SelectItem>
              {eventNameOptions.hasEmpty && <SelectItem value={EMPTY_VALUE}>(vazio)</SelectItem>}
              {eventNameOptions.values.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pagePath">Página</Label>
        <Select
          value={filters.pagePath ?? ""}
          onValueChange={(value) =>
            startTransition(() => form.setValue("pagePath", value || undefined))
          }
          disabled={isPending}
        >
          <SelectTrigger id="pagePath">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Página</SelectLabel>
              <SelectItem value="">Todas</SelectItem>
              {pagePathOptions.hasEmpty && <SelectItem value={EMPTY_VALUE}>(vazio)</SelectItem>}
              {pagePathOptions.values.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetId">Target ID</Label>
        <Select
          value={filters.targetId ?? ""}
          onValueChange={(value) =>
            startTransition(() => form.setValue("targetId", value || undefined))
          }
          disabled={isPending}
        >
          <SelectTrigger id="targetId">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Target ID</SelectLabel>
              <SelectItem value="">Todos</SelectItem>
              {targetIdOptions.hasEmpty && <SelectItem value={EMPTY_VALUE}>(vazio)</SelectItem>}
              {targetIdOptions.values.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userId">Usuário</Label>
        <Select
          value={filters.userId ?? ""}
          onValueChange={(value) =>
            startTransition(() => form.setValue("userId", value || undefined))
          }
          disabled={isPending}
        >
          <SelectTrigger id="userId">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Usuário</SelectLabel>
              <SelectItem value="">Todos</SelectItem>
              {userIdOptions.hasEmpty && <SelectItem value={EMPTY_VALUE}>(vazio)</SelectItem>}
              {userIdOptions.values.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="minDate">Data inicial</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="minDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.minDate && "text-muted-foreground",
                )}
                disabled={isPending}
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.minDate ? formatDateInput(filters.minDate) : <span>Selecione uma data</span>}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={minDateCalendar}
              onSelect={(date) => {
                setMinDateCalendar(date);
                startTransition(() => form.setValue("minDate", toISODate(date)));
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxDate">Data final</Label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="maxDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.maxDate && "text-muted-foreground",
                )}
                disabled={isPending}
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.maxDate ? formatDateInput(filters.maxDate) : <span>Selecione uma data</span>}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={maxDateCalendar}
              onSelect={(date) => {
                setMaxDateCalendar(date);
                startTransition(() => form.setValue("maxDate", toISODate(date)));
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-end justify-center sm:col-span-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => startTransition(() => handleClearFilters())}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Limpar filtros
        </Button>
      </div>
    </form>
  );
};
