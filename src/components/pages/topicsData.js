import topicsData from '../../data/topicsData.json'; // Adjust the path as necessary

export const getLevels = () => topicsData.levels.map(({ level }) => level);

// topicsData.js
export const getTopicsByLevel = (level) => {
  const levelObj = topicsData.levels.find(lvl => lvl.level === level);
  return levelObj ? levelObj.points.map(({ name, path }) => ({ name, path })) : [];
};

