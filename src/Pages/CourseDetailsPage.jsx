import React from "react";
import { useParams } from "react-router-dom";

import English from "../Componnets/English/English";
import GraphicDesign from "../Componnets/GraphicDesgine/GraphicDesgine";
import UiUx from "../Componnets/UIUx/UiUx";
import VideoEditing from "../Componnets/VideoEditing/VideoEditing";

function CourseDetailsPage() {
  const { courseId } = useParams();

  const courseComponents = {
    english: <English />,
    "graphic-design": <GraphicDesign />,
    "ui-ux": <UiUx />,
    "video-editing": <VideoEditing />,
  };

  return (
    <div className="min-h-screen">
      {courseComponents[courseId] || (
        <div className="text-center text-2xl text-red-500 py-20 font-bold">
          Course Not Found
        </div>
      )}
    </div>
  );
}

export default CourseDetailsPage;
