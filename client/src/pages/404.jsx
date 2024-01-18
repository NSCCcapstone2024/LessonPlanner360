import Link from "next/link";

export default function Error() {
    return (
        <>
            <div>
                <div className="text-6xl pb-4">:(</div>
                <div className="text-xl">404 Error - This routing does not exist</div>
            </div>
            <Link href="/"><input className="bg-white hover:opacity-50 text-[#035074] py-1 px-2 mt-3 rounded" type="button" value="Continue" /></Link>
        </>
    );
}