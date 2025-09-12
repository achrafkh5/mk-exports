import Header from "@/UI/header/page";

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}  