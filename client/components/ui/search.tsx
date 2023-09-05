import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;

}

export default function Search({ value, onChange, placeholder }: Props) {
    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="email" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
            {/* <Button type="submit" onClick={onClick}>Subscribe</Button> */}
        </div>
    )
}
