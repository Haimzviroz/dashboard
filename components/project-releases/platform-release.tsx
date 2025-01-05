import { FC, Fragment, useState } from "react"

import { Platform, Formations, Release } from '@/types/interfaces';

import s from '../../styles/project-info.module.css';
import { useGetApp } from "@/hooks";
import { R_APP_DEVICES } from "@/apis/routes";

interface PlatformReleaseProps {
  platform: Platform
}

const PlatformRelease: FC<PlatformReleaseProps> = ({ platform }) => {
  const { router } = useGetApp()
  const [formations,] = useState<Formations>(platform.formations)
  const [doShowFormations, setDoShowFormations] = useState<boolean>(false)

  return (
    <Fragment>
      <thead
        className={s["main-head"]}
        onClick={() => setDoShowFormations(!doShowFormations)}>
        <tr>
          <th
            colSpan={6}
            style={{ textAlign: "left" }}
          >{platform.name}</th>
        </tr>
      </thead>
      {formations && doShowFormations && Object.keys(formations).map(formation => (
        <tbody key={formations[formation][0].catalogId} className={s["formation-row"]}>
          {formations[formation].map((forma, i) => (
            <tr key={i}>
              <th>{forma.formation}</th>
              <th>{forma.version}</th>
              <th>{forma.uploadStatus}</th>
              <th>{forma.securityStatus}</th>
              <th>{forma.policyStatus}</th>
              <th>{forma.uploadStatus === "ready" && <button onClick={() => router.push(R_APP_DEVICES + "?software=" + forma.catalogId)}>הפץ</button>}</th>
            </tr>
          ))}
        </tbody>
      ))}
    </Fragment>
  )
}

export default PlatformRelease