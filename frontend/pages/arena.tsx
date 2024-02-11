import Fight from "../components/battle/Fight";
import Loading from "../components/Loading";
import FighterSelect from "../components/battle/Intro";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

export default function Arena() {
  const router = useRouter();
  return (
    <div>
      {!router.query.hasNft ? <Fight /> : <FighterSelect />}
    </div>
  )
}
