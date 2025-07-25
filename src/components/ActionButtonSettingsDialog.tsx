import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { SimpleActionButton } from "@/contexts/RangeContext";

interface ActionButtonSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (button: SimpleActionButton) => void;
  buttonToEdit: SimpleActionButton | null;
}

export const ActionButtonSettingsDialog = ({
  open,
  onOpenChange,
  onSave,
  buttonToEdit,
}: ActionButtonSettingsDialogProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#8b5cf6");
  const [isFontAdaptive, setIsFontAdaptive] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [fontColor, setFontColor] = useState<'white' | 'black'>('white');

  useEffect(() => {
    if (buttonToEdit) {
      setName(buttonToEdit.name);
      setColor(buttonToEdit.color);
      setIsFontAdaptive(buttonToEdit.isFontAdaptive ?? true);
      setFontSize(buttonToEdit.fontSize ?? 12);
      setFontColor(buttonToEdit.fontColor ?? 'white');
    } else {
      // Reset to defaults for new button
      setName("");
      setColor("#8b5cf6");
      setIsFontAdaptive(true);
      setFontSize(12);
      setFontColor('white');
    }
  }, [buttonToEdit, open]);

  const handleSave = () => {
    if (!name) return; // Basic validation

    const savedButton: SimpleActionButton = {
      id: buttonToEdit?.id || Date.now().toString(),
      type: 'simple',
      name,
      color,
      isFontAdaptive,
      fontSize: isFontAdaptive ? undefined : fontSize,
      fontColor,
    };
    onSave(savedButton);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{buttonToEdit ? "Настройка кнопки" : "Создать кнопку"}</DialogTitle>
          <DialogDescription>
            Настройте внешний вид и поведение кнопки действия.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="например, Raise" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Цвет</Label>
            <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10" />
          </div>
          
          <div className="space-y-3 pt-4 border-t">
             <Label className="font-semibold">Настройки шрифта</Label>
             <div className="flex items-center space-x-2">
                <Checkbox id="adaptiveFont" checked={isFontAdaptive} onCheckedChange={(checked) => setIsFontAdaptive(Boolean(checked))} />
                <Label htmlFor="adaptiveFont" className="cursor-pointer">Адаптивный шрифт</Label>
             </div>
             <div className="space-y-2">
                <Label htmlFor="fontSize">Размер шрифта (px)</Label>
                <Input id="fontSize" type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} disabled={isFontAdaptive} />
             </div>
             <div className="space-y-2">
                <Label>Цвет шрифта</Label>
                <RadioGroup value={fontColor} onValueChange={(value) => setFontColor(value as 'white' | 'black')} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="white" id="r-white" />
                        <Label htmlFor="r-white" className="cursor-pointer">Белый</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="black" id="r-black" />
                        <Label htmlFor="r-black" className="cursor-pointer">Черный</Label>
                    </div>
                </RadioGroup>
             </div>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
