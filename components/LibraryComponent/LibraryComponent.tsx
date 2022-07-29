import Link from "next/link";

const LibraryComponent = () => {
  return (
    <div className="menu">
      <Link href="/">
        <button>Home</button>
      </Link>
      <Link href="/create">
        <button>Add book</button>
      </Link>
      <Link href="/borrow">
        <button>Borrow book</button>
      </Link>
      <Link href="/return">
        <button>Return book</button>
      </Link>
      <Link href="/budget">
        <button>Manage budget</button>
      </Link>
    </div>
  );
};

export default LibraryComponent;
