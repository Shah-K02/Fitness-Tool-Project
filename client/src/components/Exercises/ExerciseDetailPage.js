import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../BackButton";
import "./ExerciseDetailPage.css";

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchExercise = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/exercises/${encodeURIComponent(id)}`
        );
        if (cancelled) return;
        setExercise(response.data);

        const videoResponse = await axios.get(
          `/api/exercises/videos/${encodeURIComponent(response.data.name)}`
        );
        if (!cancelled) setVideos(videoResponse.data);
      } catch (err) {
        console.error("Error fetching exercise:", err);
        if (!cancelled) setError("Couldn't load this exercise. Try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchExercise();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading || error || !exercise) {
    return (
      <div className="exercise-detail-page">
        <BackButton className="back-button" backText=" Back" />
        <p className={`state-message${error ? " is-flag" : ""}`}>
          {error || (isLoading ? "Loading…" : "Exercise not found.")}
        </p>
      </div>
    );
  }

  const {
    name,
    gifUrl,
    bodyPart,
    target,
    equipment,
    secondaryMuscles = [],
    instructions = [],
    description,
    difficulty,
  } = exercise;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${name} exercise how to`
  )}`;

  return (
    <div className="exercise-detail-page">
      <BackButton className="back-button" backText=" Back" />

      <div className="exercise-detail-header">
        <div className="exercise-detail-media">
          <img src={gifUrl} alt={`Animation showing ${name}`} />
        </div>
        <div className="exercise-detail-summary">
          <h1>{name}</h1>
          {description && <p className="exercise-detail-description">{description}</p>}
          <dl className="exercise-detail-facts">
            <div>
              <dt>Body part</dt>
              <dd>{bodyPart}</dd>
            </div>
            <div>
              <dt>Target</dt>
              <dd>{target}</dd>
            </div>
            <div>
              <dt>Equipment</dt>
              <dd>{equipment}</dd>
            </div>
            {difficulty && (
              <div>
                <dt>Difficulty</dt>
                <dd>{difficulty}</dd>
              </div>
            )}
            {secondaryMuscles.length > 0 && (
              <div>
                <dt>Also works</dt>
                <dd>{secondaryMuscles.join(", ")}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {instructions.length > 0 && (
        <section className="exercise-detail-section">
          <h2>How to do it</h2>
          <ol className="exercise-instructions">
            {instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="exercise-detail-section">
        <h2>Watch it done</h2>
        {videos.length > 0 ? (
          <div className="exercise-videos">
            {videos.map((video) => (
              <figure className="exercise-video" key={video.videoId}>
                <div className="exercise-video-frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <figcaption>
                  {video.title}
                  {video.channelName && <span> &middot; {video.channelName}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="exercise-videos-fallback">
            <a href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
              Find video tutorials for {name} on YouTube
            </a>
          </p>
        )}
      </section>
    </div>
  );
};

export default ExerciseDetailPage;
