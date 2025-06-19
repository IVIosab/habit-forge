import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Component() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
			{/* Header */}
			<header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
				<div className="flex items-center justify-center">
					<h1 className="text-2xl font-bold text-slate-900">
						HabitForge
					</h1>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 flex items-center">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
							{/* Hero Content */}
							<div className="space-y-6">
								<h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900">
									Forge your future, one habit at a time.
								</h2>
								<p className="mx-auto max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
									HabitForge is a sleek, modern habit tracker
									that helps you build powerful routines and
									visualize your progress with ease. With an
									intuitive UI, daily habit check-ins, and
									beautiful charts, you'll stay motivated and
									consistent — whether you're drinking more
									water, reading, or hitting the gym. Designed
									for focus. Built for change.
								</p>
							</div>

							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 pt-8">
								<Button
									asChild
									size="lg"
									className="text-lg px-8 py-6 h-auto"
								>
									<Link href="/register">Get Started</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									size="lg"
									className="text-lg px-8 py-6 h-auto"
								>
									<Link href="/login">Login</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="w-full py-6 px-4 md:px-6 border-t bg-white/80 backdrop-blur-sm">
				<div className="container mx-auto">
					<p className="text-center text-sm text-slate-500">
						© {new Date().getFullYear()} HabitForge. Built for
						change.
					</p>
				</div>
			</footer>
		</div>
	);
}
