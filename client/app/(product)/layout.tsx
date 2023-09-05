import Navbar from "@/components/ui/Navbar"

export default function ProductLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <Navbar />
            {children}
        </section>
    )
}