import Head from "next/head";
import Link from "next/link";

const LandingPage = ({ title, description, features, cta, link }: any) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="productivity, accountability, habits, goals, tasks" />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-center p-6 text-white">
        <h1 className="text-5xl font-extrabold mb-4">{title}</h1>
        <p className="text-lg max-w-2xl mb-6">{description}</p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl">
          {features.map((feature : any, index: any) => (
            <div key={index} className="p-6 bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-xl">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
        <Link href={link} className="mt-8 bg-white text-blue-600 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-200 transition">
            {cta}
        </Link>
      </div>
    </>
  );
};

export default LandingPage;